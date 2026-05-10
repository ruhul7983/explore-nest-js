import { IsArray, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  details: string;

  @Transform(
    ({ value }) => (Array.isArray(value) ? value : [value]), // 👈 single string আসলেও array বানাও
  )
  @IsArray()
  @IsString({ each: true })
  techStack: string[];
}
