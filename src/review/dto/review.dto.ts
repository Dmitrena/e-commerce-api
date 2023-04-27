import { IsNumber, IsString, Max, Min } from 'class-validator';

export class ReviewDto {
  @IsNumber()
  //   @Length(1, 5)
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  text: string;
}
