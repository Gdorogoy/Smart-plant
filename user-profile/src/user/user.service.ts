import { auth } from './../../../auth/node_modules/.pnpm/@prisma+client@7.4.1_prisma@7.4.1_@types+react@19.2.14_react-dom@19.2.4_react@19.2.4__r_8e53772b4f7db0920d7f3afa4e50fe46/node_modules/.prisma/client/index.d';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserRequest } from './dto/create.user.request';
import { GetUserRequest } from './dto/get.user.request';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService:PrismaService){}



  // User is created via register method in Auth service and passed down here
  // Saves the users , goal and username
  async createUser(req:CreateUserRequest){
    try{
      const {authId,username,goal}=req;
      const user=await this.prismaService.profile.findFirst({
        where:{
          OR:[
            {username},
            {authId}
          ]
        }
      });

      if(user){
        throw new ConflictException("Username already in user.");
      }

      const userToCreate=await this.prismaService.profile.create({
        data:{
          authId,
          username,
          goal,
        }
      });
      return userToCreate;

    }
    catch(err){
      throw new InternalServerErrorException(err);
    }

  }

  // User logged in via Auth service
  // Retruns users non auth related data
  async getUser(id:string){
    try{
      const authId=id;

      const user=await this.prismaService.profile.findUnique({
        where:{
          authId:authId
        },
        select:{
          username:true,
          goal:true,
          id:true
        }
      });

      if(!user){
        throw new NotFoundException("User not found");
      }

      return user;

    }
    catch(err){
      throw new InternalServerErrorException(err);

    }
  }
}
