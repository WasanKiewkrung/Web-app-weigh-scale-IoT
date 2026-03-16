import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../esp/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string): Promise<string | null> {
    const user = await this.userModel.findOne({ username });

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    // 🔥 แก้จุดสำคัญตรงนี้
    const userDoc = user as UserDocument;

    const payload = {
      sub: userDoc._id.toString(),
      username: userDoc.username,
    };

    return this.jwtService.sign(payload);
  }
}
