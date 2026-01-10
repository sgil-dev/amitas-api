import { User } from "src/providers/mongo/schemas/user.schema";
import { UserResponseDto } from "src/users/dto/response/user-response.dto";

export function formatUserResponse(user: User): UserResponseDto {
    return {
        id: user._id?.toString() ?? '',
        name: user.name,
        surname: user.surname,
        email: user.email,
    };
}