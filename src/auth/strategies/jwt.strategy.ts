import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secret123',
    });
  }

  async validate(payload: any): Promise<AuthenticatedUser> {
    return { _id: payload.sub, email: payload.email, name: payload.name, surname: payload.surname };
  }
}