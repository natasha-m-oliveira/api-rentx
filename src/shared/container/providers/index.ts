import { container } from "tsyringe";

import { IDateProvider } from "./DateProvider.ts/IDateProvider";
import { DayjsDateProvider } from "./DateProvider.ts/implementations/DayjsDateProvider";

container.registerSingleton<IDateProvider>("DateProvider", DayjsDateProvider);
