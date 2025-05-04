import { Controller, Post, Get, Body, Res, Param, Req, Put } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller()
export class GatewayController {
  constructor(private readonly http: HttpService) {}

  // AUTH -----------------------------
  @Post('auth/register')
  async register(@Body() body: any, @Res() res) {
    const { data } = await firstValueFrom(
      this.http.post('http://auth:3000/auth/register', body),
    );
    return res.send(data);
  }

  @Post('auth/login')
  async login(@Body() body: any, @Res() res) {
    const { data } = await firstValueFrom(
      this.http.post('http://auth:3000/auth/login', body),
    );
    return res.send(data);
  }

  // USER -----------------------------
  // Tạo hồ sơ cá nhân (POST /user/me)
  @Post('user/me')
  async createProfile(@Req() req, @Body() body: any, @Res() res) {
    const { authorization } = req.headers;
    const { data } = await firstValueFrom(
      this.http.post('http://user:3000/user/me', body, {
        headers: { Authorization: authorization },
      }),
    );
    return res.send(data);
  }

  // Lấy hồ sơ cá nhân (GET /user/me)
  @Get('user/me')
  async getProfile(@Req() req, @Res() res) {
    const { authorization } = req.headers;
    const { data } = await firstValueFrom(
      this.http.get('http://user:3000/user/me', {
        headers: { Authorization: authorization },
      }),
    );
    return res.send(data);
  }

  // Cập nhật hồ sơ (PUT /user/me)
  @Put('user/me/update')
  async updateProfile(@Req() req, @Body() body: any, @Res() res) {
    const { authorization } = req.headers;
    const { data } = await firstValueFrom(
      this.http.put('http://user:3000/user/me', body, {
        headers: { Authorization: authorization },
      }),
    );
    return res.send(data);
  }

  // CV COMMAND -----------------------
  // @Post('cv')
  // async createCV(@Body() body: any, @Res() res) {
  //   const { data } = await firstValueFrom(
  //     this.http.post(`http://cv-command:3000/cv`, body),
  //   );
  //   return res.send(data);
  // }

  // CV QUERY -------------------------
  // @Get('cv/:id')
  // async getCV(@Param('id') id: string, @Res() res) {
  //   const { data } = await firstValueFrom(
  //     this.http.get(`http://cv-query:3000/cv/${id}`),
  //   );
  //   return res.send(data);
  // }
}
