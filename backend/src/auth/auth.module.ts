import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { User, UserSchema } from '../esp/schemas/user.schema';
import { MeatData, MeatDataSchema } from '../esp/schemas/meat-data.schema'; // ✅ เพิ่ม import schema เนื้อ

import { JwtStrategy } from './jwt.strategy'; // ✅ ใช้กับ JwtAuthGuard

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: MeatData.name, schema: MeatDataSchema }, // ✅ เพิ่ม MeatData schema เข้า DI container
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy, // ✅ ต้องมี strategy เพื่อใช้กับ AuthGuard
  ],
  controllers: [AuthController],
})
export class AuthModule { }
