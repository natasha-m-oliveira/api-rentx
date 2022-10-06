import { container } from "tsyringe";

import { IDateProvider } from "./DateProvider/IDateProvider";
import { DayjsDateProvider } from "./DateProvider/implementations/DayjsDateProvider";
import { JWTTokenProvider } from "./TokenProvider/implementations/JWTTokenProvider";
import { ITokenProvider } from "./TokenProvider/ITokenProvider";

container.registerSingleton<IDateProvider>("DateProvider", DayjsDateProvider);

container.registerSingleton<ITokenProvider>("TokenProvider", JWTTokenProvider);
