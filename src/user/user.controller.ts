import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";

@Controller("users")
export class UserController {
    constructor(private prisma: PrismaService){}
    
    @UseGuards(AuthGuard("jwt"))
    @Get("me")
    getMe() {}
}