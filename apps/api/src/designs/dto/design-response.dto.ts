export class DesignResponseDto {
  id: string;
  prompt: string;
  style: string;
  imageUrl: string | null;
  status: string;
  jobId: string | null;
  width: number;
  height: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PaginatedDesignsDto {
  data: DesignResponseDto[];
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
