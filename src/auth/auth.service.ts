import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    
    try {
      // Generate the password hash
      const hash = await argon.hash(dto.password)
      
      // Save the new user into db
      const user = await this.prisma.user.create({
          data:{
              email: dto.email,
              hash
          },
          select: {
              id: true,
              email: true,
              createdAt: true,
              // don’t select hash
          },
      })
      
      // Return saved user back to client
      
      return user;
      
    } catch (error) {
      
      if(error instanceof PrismaClientKnownRequestError)
      {
        if(error.code === 'P2002')
        {
          throw new ForbiddenException("Credentials taken!")
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    
     // Find the user by email, if not exists, throw Exception
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email
        },
      })
      if(!user) throw new ForbiddenException("Invalid credentials!")
      
      // Compare passwords - if incorrect, throw Exception
      const pwMatches = await argon.verify(user.hash, dto.password)
      if(!pwMatches) throw new ForbiddenException("Invalid credentials!")
        
      const {hash, ...result} = user;
      
      // Send back the user
      return result;
      
  }
}
