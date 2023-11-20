import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { PostDTO } from './dto/postDto';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Comment } from './entities/comment.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async createPost(userId: number, postDto, file: Express.Multer.File) {
    let imgUrl = '';

    if (!file) {
      imgUrl = null;
    } else {
      imgUrl = file.filename;
    }

    const newPost = await this.postRepository.create({
      ...postDto,
      userId,
      imgUrl,
    });
    return await this.postRepository.save(newPost);
  }

  async getAllPosts() {
    return await this.postRepository.find({
      select: ['id', 'title', 'imgUrl', 'content'],
    });
  }

  async getUsersPosts(userId: number) {
    return await this.postRepository.find({ where: { userId } });
  }

  async getMyPosts(userId: number) {
    return await this.postRepository.find({ where: { userId } });
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne({ where: { id } });
    const comments = await this.commentRepository.find({
      where: { postId: id },
    });
    return { post, comments };
  }

  async updatePost(
    postId: number,
    postDto: PostDTO.UpdatePost,
    userId: number,
  ) {
    await this.postRepository.update({ id: postId, userId }, postDto);
    return '수정완료';
  }

  async deletePost(user: User, postId: number, usersPassword: string) {
    const { password, id } = user;

    const comparedPassword = await bcrypt.compareSync(usersPassword, password);

    if (!comparedPassword) {
      throw new NotAcceptableException('비밀번호가 일치하지 않습니다.');
    }

    await this.postRepository.delete({ userId: id, id: postId });
    return '삭제완료';
  }

  async createComment(userId: number, postId: number, comment: string) {
    const newComment = await this.commentRepository.create({
      userId,
      postId,
      comment,
    });

    return await this.commentRepository.save(newComment);
  }

  async deleteComment(user: User, commentId, password) {
    const id = user.id;
    const comparedPassword = await bcrypt.compareSync(password, user.password);
    if (!comparedPassword) {
      throw new NotAcceptableException('비밀번호가 일치하지 않습니다.');
    }

    const comment = await this.commentRepository.findOne({
      where: { userId: id },
    });

    if (!comment) {
      throw new NotAcceptableException(
        '작성자만 해당 댓글을 삭제할 수 있습니다.',
      );
    }

    return await this.commentRepository.delete({ id: commentId });
  }
}
