import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

export interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService, 
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>("JWT_SECRET")!, // ensure non-null
    });
  }

  async validate(payload: JwtPayload) {
    const findUser = await this.prisma.user.findUnique({
      where:{
        id: payload.sub
      }
    })
    
    if (!findUser) {
      return null; // or throw new UnauthorizedException();
    }
    
    const {hash, ...user} = findUser;
    
    console.log(user)
    
    return user;
  }
}
