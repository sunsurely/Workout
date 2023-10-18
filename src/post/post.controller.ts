import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { PostDTO } from './dto/postDto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @Req() req: any,
    @Body() postDto: PostDTO.CreatePost,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.postService.createPost(req.user.id, postDto, file);
  }

  @Get('/')
  async getAllPosts() {
    return await this.postService.getAllPosts();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async getMyPosts(@Req() req: any) {
    return await this.postService.getMyPosts(req.user.id);
  }

  @Get('/user/:userId')
  async getUsersPosts(
    @Param(
      'userId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId,
  ) {
    return this.postService.getUsersPosts(userId);
  }

  @Get('/detail/:postId')
  async getPostById(
    @Param(
      'postId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    postId,
  ) {
    return await this.postService.getPostById(postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:postId')
  async updatePost(
    @Param(
      'postId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    postId,
    @Req() req: any,
    @Body() postDto: PostDTO.UpdatePost,
  ) {
    return await this.postService.updatePost(postId, postDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:postId')
  async deletePost(
    @Param(
      'postId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    postId,
    @Req() req: any,
    @Body() postDto: PostDTO.DeletePost,
  ) {
    return await this.postService.deletePost(
      req.user,
      postId,
      postDto.password,
    );
  }
}
