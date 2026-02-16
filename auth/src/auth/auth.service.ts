import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request,Response } from 'express';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, verify } from 'argon2';
import { Payload } from './entities/jwt.entity';
import { RegisterRequest } from './dto/register.req';
import { LoginRequest } from './dto/login.req';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {

  private readonly JWT_ACCESS_TOKEN_TTL: JwtSignOptions['expiresIn'];
  private readonly JWT_REFRESH_TOKEN_TTL:JwtSignOptions['expiresIn'];
  private readonly COOKIE_DOMAIN: string;
  private readonly IS_PRODUCTION: boolean;
  private readonly USER_SERVICE_URL:string;



  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService
  ){
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow('JWT_ACCESS_TOKEN_TTL');
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow('JWT_REFRESH_TOKEN_TTL');
    this.COOKIE_DOMAIN = configService.getOrThrow('COOKIE_DOMAIN');
    this.IS_PRODUCTION = configService.get('NODE_ENV') === 'production';
    this.USER_SERVICE_URL= configService.getOrThrow('USER_SERVICE_URL');
  }
  

  //Registers the user via email and password
  //Passes down the other info to User service via axios REST call
  //TODO: Add try catch and custom handling of axios and errors
  async register(req:RegisterRequest, res:Response){
    const{email,password,goal,username,}=req;

    const isExists=await this.prismaService.user.findUnique({
      where:{
        email
      }
    })

    if(isExists){
      throw new ConflictException("User already exists with this email");
    }

    const hashedPassword=await hash(password);
    
    const user=await this.prismaService.user.create({
      data:{
        email,
        password:hashedPassword,
      }
    });
    const data={
      goal:goal,
      username:username,
      authId:user.id
    }

    try{
      const axiosResponse=firstValueFrom( this.httpService.post(`${this.USER_SERVICE_URL}/create`,data,{
        headers:{
          "Content-Type":'application/json'
        }
      }));
    
    }catch(err){
      throw new ConflictException(err);
    }

    return this.auth(res,user.id);
  }

  //Logs in the user if the credentials are valid
  //Passes down the id to User service to get other info via axios REST call
  //TODO: Add try catch and custom handling of axios and errors
  async login(req:LoginRequest, res:Response){
    const {email,password}=req;

    const user=await this.prismaService.user.findUnique({
      where:{
        email
      },
    });

    if(!user){
      throw new NotFoundException("User not found");
    }

    const same=await verify(user.password,password);
    if(!same){
      throw new UnauthorizedException("Password dosent match");
    }

    try{
      const axiosResponse=firstValueFrom(this.httpService.get(`${this.USER_SERVICE_URL}/get/${user.id}`));
    }catch(err){
      throw new ConflictException(err);
    }
    
    return this.auth(res,user.id);
    
  }

  logout(req:LoginRequest, res:Response){
    return this.setCookie(res,"refreshToken",new Date(0));
  }


  //Method for refreshing the user tokens
  //If expired/invalid credentials throws
  //TODO: Add try catch and custom handling of errors
  async refresh(req:Request,res:Response){
    const refreshToken=req.cookies['refreshToken'];
    if(!refreshToken){
      throw new UnauthorizedException("Refresh token must be included");
    }

    const payload:Payload=await this.jwtService.verifyAsync(refreshToken);

    if(payload){
      const user=await this.prismaService.user.findUnique({
        where:{
          id:payload.id
        }
      });
      if(!user){
        throw new NotFoundException('User not found');
      }

      return this.auth(res,payload.id);
    }
  }

  //Method for validating user on the id if it exists
  //TODO: Add try catch and custom errors
  async validate(id:string){
    const user=await this.prismaService.user.findUnique({
      where:{
        id
      }
    });
    if(!user){
      throw new NotFoundException("User not found");
    }
    return user;
  }

  //Method for seting up the cookie
  private setCookie(res:Response ,value:string, expiresAt:Date){
    res.cookie('refreshToken',value,{
      httpOnly:true,
      domain:this.COOKIE_DOMAIN,
      expires:expiresAt,
      secure:this.IS_PRODUCTION,
      sameSite:'lax',

    });
    
  }

  //Method uset to update cookies in the response
  private auth(res:Response,id :string){
    const {accessToken,refreshToken}=this.generateTokens(id);
    this.setCookie(res,refreshToken,new Date(Date.now()+7*60*60*24*1000));
    return{accessToken};
  }

  //Genereate JWT tokens
  private generateTokens (id:string){
    const payload={id};
    const accessToken=this.jwtService.sign(payload,
      {
      expiresIn:this.JWT_ACCESS_TOKEN_TTL 
    });
    const refreshToken=this.jwtService.sign(payload,{'expiresIn':this.JWT_REFRESH_TOKEN_TTL});
    return {accessToken,refreshToken}
  }


}
