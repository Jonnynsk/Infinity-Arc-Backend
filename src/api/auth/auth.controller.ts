import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { ApiConflictResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";

import { LoginRequest, RegisterRequest, AuthResponse } from "./dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: "Register a new user",
    description: "Register a new user account and return an access token",
  })
  @ApiConflictResponse({ description: "Username or email already exists" })
  @ApiOkResponse({ type: AuthResponse })
  @Post("register")
  public async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterRequest,
  ) {
    return await this.authService.register(res, dto);
  }

  @ApiOperation({
    summary: "Login a user",
    description: "Login a user and return an access token",
  })
  @ApiOkResponse({ type: AuthResponse })
  @Post("login")
  public async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginRequest,
  ) {
    return await this.authService.login(res, dto);
  }

  @ApiOperation({
    summary: "Refresh access token",
    description: "Refresh the access token and return a new access token",
  })
  @ApiOkResponse({ type: AuthResponse })
  @Post("refresh")
  public async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.refresh(req, res);
  }

  @ApiOperation({
    summary: "Logout a user",
    description: "Logout a user and clears authentication cookies",
  })
  @Post("logout")
  public async logout(@Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(res);
  }
}
