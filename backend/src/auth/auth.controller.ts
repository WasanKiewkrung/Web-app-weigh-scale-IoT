import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  Query,                      
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // ✅ [เพิ่ม] สำหรับใช้ Mongoose Model
import { Model } from 'mongoose';                // ✅ [เพิ่ม]

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

import { MeatData, MeatDataDocument } from '../esp/schemas/meat-data.schema'; // ✅ [เพิ่ม]

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectModel(MeatData.name) private meatModel: Model<MeatDataDocument>, // ✅ [เพิ่ม]
  ) { }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    const token = await this.authService.validateUser(username, password);

    if (!token) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return {
      access_token: token,
      message: 'Login successful',
    };
  }

  // ✅ [GET] /auth/protected/data?date=YYYY-MM-DD
  // ✅ ดึงจาก MongoDB และกรองตามวันที่ที่ผู้ใช้เลือก
  @UseGuards(JwtAuthGuard)
  @Get('protected/data')
  async getProtectedData(@Query('date') date?: string) {
    if (!date) {
      throw new HttpException('Missing date', HttpStatus.BAD_REQUEST);
    }

    const data = await this.meatModel
      .find({ date })
      .select('time meatType weight -_id')
      .lean();

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
