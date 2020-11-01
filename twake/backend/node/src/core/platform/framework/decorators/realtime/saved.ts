import { PathResolver, getPath } from "..";
import { SaveResult } from "../../api/crud-service";
import { RealtimeEntityEvent, RealtimeEntityActionType } from "../../../services/realtime/types";
import { eventBus } from "../../../services/realtime/bus";

/**
 *
 * @param path the path to push the notification to
 * @param resourcePath the path of the resource itself
 */
export function RealtimeSaved<T>(path: string | PathResolver<T>, resourcePath?: string | PathResolver<T>): MethodDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = async function (...args: any[]) {
      const result: SaveResult<T> = await originalMethod.apply(this, args);

      if (!(result instanceof SaveResult)) {
        return result;
      }

      eventBus.publish<T>(RealtimeEntityActionType.Saved, {
        type: result.type,
        path: getPath(path, result),
        resourcePath: getPath(resourcePath, result),
        entity: result.entity,
        result
      } as RealtimeEntityEvent<T>);

      return result;
    };
  };
}