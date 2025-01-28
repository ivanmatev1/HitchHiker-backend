import { IsNumber, IsNotEmpty } from "class-validator";

export class CreateRouteRequestDto {
    @IsNumber()
    @IsNotEmpty()
    routeId: number;
}
