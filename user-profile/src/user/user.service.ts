import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRequest } from './dto/create.user.request';
import { GetUserRequest } from './dto/get.user.request';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService:PrismaService){}



  // User is created via register method in Auth service and passed down here
  // Saves the users , goal and username
  //TODO: create custom username expection , wrap in try catch
  async createUser(req:CreateUserRequest){
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

  // User logged in via Auth service
  // Retruns users non auth related data
  //TODO: wrap in try catch
  async getUser(id:string){
    const authId=id;

    const user=await this.prismaService.profile.findUnique({
      where:{
        authId
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
}
