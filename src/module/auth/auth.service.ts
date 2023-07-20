import type { User } from "@prisma/client";
import { ConflictException, Injectable, NotFoundException, Inject, BadRequestException } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import * as bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken"
import { PrismaService } from "@prisma";
import { sign, refreshSign } from "@helpers";
import type {
  SignInRequest,
  SignUpRequest,
  SignUpResponse,
  SignoutRequest,
  SignInResponse,
} from './interfaces';

@Injectable()
export class AuthService {
  readonly #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async signUp(payload: SignUpRequest): Promise<SignUpResponse> {
    try {
      await this.#_checkExistingUser({ email: payload.email });

      const hash = await bcrypt.hash(payload.password, 10);

      const newUser = await this.#_prisma.user.create({
        data: {
          username: payload.username,
          password: hash,
          email: payload.email,
          token: '',
        },
        select: {
          id: true,
        },
      });

      console.log(newUser);

      const accessToken = sign({ id: newUser.id });
      const refreshToken = refreshSign({ id: newUser.id });

      await this.#_prisma.user.update({
        where: {
          id: newUser.id,
        },
        data: {
          token: accessToken,
        },
      });

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async signIn(payload: SignInRequest): Promise<SignInResponse> {
    const user = await this.#_checkUser({
      email: payload.email,
      password: payload.password,
    });


         const accessToken = sign({ id: user.id });
      const refreshToken = refreshSign({ id: user.id });

    const writeToken = await this.#_prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        token: accessToken
      }
    });

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
  }

  async signOut(payload: SignoutRequest): Promise<any> {
    const token = payload.token;
    const VerifyToken = await jwt.verify(token, process.env.SECRET_KEY);
    const id = VerifyToken.id;

      const userrr = await this.#_prisma.user.update({
        where: {
          id: id,
        },
        data: {
          token: '',
        },
      });

      console.log(userrr);
      

    return {
      message: 'Successfully Signed out',
    };
  }

  async #_checkUser(payload: {
    email: string;
    password?: string;
  }): Promise<Pick<User, 'id'>> {
    const user = await this.#_prisma.user.findFirst({
      where: {
        email: payload.email,
        deletedAt: null,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (payload.password) {
      const passwordMatch = await bcrypt.compare(
        payload.password,
        user.password,
      );
      if (!passwordMatch) {
        throw new NotFoundException('Invalid password');
      }
    }

    return {
      id: user.id,
    };
  }

  async #_checkExistingUser(payload: { email: string }): Promise<null> {
    const user = await this.#_prisma.user.findFirst({
      where: {
        email: payload.email,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (user) {
      throw new ConflictException('User already exists');
    }

    return null;
  }
}
