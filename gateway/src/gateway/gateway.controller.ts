import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Param,
  Req,
  Put,
} from '@nestjs/common';
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
  @Post('cv/create')
  async createCV(@Req() req, @Body() body: any, @Res() res) {
    const { authorization } = req.headers;
    const { data } = await firstValueFrom(
      this.http.post('http://cv-command:3000/cv/create', body, {
        headers: { Authorization: authorization },
      }),
    );
    return res.send(data);
  }

  @Post('cv/add-section')
  async addSection(@Req() req, @Body() body: any, @Res() res) {
    const { authorization } = req.headers;
    const { data } = await firstValueFrom(
      this.http.post('http://cv-command:3000/cv/add-section', body, {
        headers: { Authorization: authorization },
      }),
    );
    return res.send(data);
  }

  @Post('cv/update-section')
  async updateSection(@Req() req, @Body() body: any, @Res() res) {
    const { authorization } = req.headers;
    const { data } = await firstValueFrom(
      this.http.post('http://cv-command:3000/cv/update-section', body, {
        headers: { Authorization: authorization },
      }),
    );
    return res.send(data);
  }

  @Post('cv/remove-section')
  async removeSection(@Req() req, @Body() body: any, @Res() res) {
    const { authorization } = req.headers;
    const { data } = await firstValueFrom(
      this.http.post('http://cv-command:3000/cv/remove-section', body, {
        headers: { Authorization: authorization },
      }),
    );
    return res.send(data);
  }

  @Post('cv/rename')
  async renameCV(@Req() req, @Body() body: any, @Res() res) {
    const { authorization } = req.headers;
    const { data } = await firstValueFrom(
      this.http.post('http://cv-command:3000/cv/rename', body, {
        headers: { Authorization: authorization },
      }),
    );
    return res.send(data);
  }

  @Post('cv/change-template')
  async changeTemplate(@Req() req, @Body() body: any, @Res() res) {
    const { authorization } = req.headers;
    const { data } = await firstValueFrom(
      this.http.post('http://cv-command:3000/cv/change-template', body, {
        headers: { Authorization: authorization },
      }),
    );
    return res.send(data);
  }

  @Post('cv/undo')
  async undoCV(@Req() req, @Body() body: any, @Res() res) {
    const { authorization } = req.headers;
    const { data } = await firstValueFrom(
      this.http.post('http://cv-command:3000/cv/undo', body, {
        headers: { Authorization: authorization }, // 🟢 Fix here
      }),
    );
    return res.send(data);
  }

  // CV QUERY -------------------------
  @Get('cv/list')
  async listCVs(@Req() req, @Res() res) {
    const { authorization } = req.headers;
    const { data } = await firstValueFrom(
      this.http.get('http://cv-query:3000/cv/list', {
        headers: { Authorization: authorization },
      }),
    );
    return res.send(data);
  }

  @Get('cv/:id')
  async getCV(@Param('id') id: string, @Req() req, @Res() res) {
    const { authorization } = req.headers;
    const { data } = await firstValueFrom(
      this.http.get(`http://cv-query:3000/cv/${id}`, {
        headers: { Authorization: authorization },
      }),
    );
    return res.send(data);
  }
}
