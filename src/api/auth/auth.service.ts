import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { hash, verify } from "argon2";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";

import { PrismaService } from "src/infra/prisma/prisma.service";

import { LoginDto, RegisterDto } from "./dto";
import { JwtPayload } from "./interfaces";
import { isDev, ms, StringValue } from "src/common/utils";

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: StringValue;
  private readonly JWT_REFRESH_TOKEN_TTL: StringValue;
  private readonly COOKIES_DOMAIN: string;

  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow<StringValue>(
      "JWT_ACCESS_TOKEN_TTL",
    );
    this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<StringValue>(
      "JWT_REFRESH_TOKEN_TTL",
    );
    this.COOKIES_DOMAIN =
      this.configService.getOrThrow<string>("COOKIES_DOMAIN");
  }

  public async register(res: Response, dto: RegisterDto) {
    const { name, username, email, password, country } = dto;

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email,
        username,
      },
    });

    if (existingUser) {
      throw new ConflictException("Username or email already exists");
    }

    const hashedPassword = await hash(password);

    const user = await this.prismaService.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        country,
      },
    });

    return this.auth(res, user);
  }

  public async login(res: Response, dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException("Invalid email or password");
    }

    const isPasswordValid = await verify(user.password, password);

    if (!isPasswordValid) {
      throw new NotFoundException("Invalid email or password");
    }

    return this.auth(res, user);
  }

  public async refresh(req: Request, res: Response) {
    if (!req || !req.cookies) {
      throw new UnauthorizedException("Unauthorized");
    }

    const refreshToken = req.cookies["refreshToken"];

    if(refreshToken) {
        const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

        if(payload) {
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: payload.id,
                },
            });

            if(user) {
                return this.auth(res, user);
            }
        }
    }
  }

  public async logout(res: Response) {
    return this.setCookie(res, "", new Date(0));
  }

  private async auth(res: Response, user: User) {
    const { accessToken, refreshToken, refreshTokenExpiresIn } =
      await this.generateTokens(user);

    this.setCookie(res, refreshToken, refreshTokenExpiresIn);

    return {
      accessToken,
    };
  }

  private async generateTokens(user: User) {
    const payload: JwtPayload = {
      id: user.id,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL,
    });

    const refreshTokenExpiresIn = new Date(
      Date.now() + ms(this.JWT_REFRESH_TOKEN_TTL),
    );

    return {
      accessToken,
      refreshToken,
      refreshTokenExpiresIn,
    };
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie("refreshToken", value, {
      httpOnly: true,
      secure: !isDev(this.configService),
      domain: this.COOKIES_DOMAIN,
      expires,
      sameSite: "lax",
    });
  }
}
