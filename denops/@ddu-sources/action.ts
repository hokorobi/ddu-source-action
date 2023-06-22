import {
  BaseSource,
  Context,
  DduItem,
  Item,
} from "https://deno.land/x/ddu_vim@v3.2.6/types.ts";
import { Denops } from "https://deno.land/x/ddu_vim@v3.2.6/deps.ts";
import { ActionData } from "../@ddu-kinds/action.ts";

type Params = {
  actions: string[];
  name: string;
  items: DduItem[];
};

export class Source extends BaseSource<Params> {
  kind = "action";

  override gather(args: {
    denops: Denops;
    context: Context;
    sourceParams: Params;
  }): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream({
      start(controller) {
        controller.enqueue(args.sourceParams.actions.map((action) => {
          return {
            word: action,
            action: {
              action: action,
              name: args.sourceParams.name,
              items: args.sourceParams.items,
            },
          };
        }));
        controller.close();
      },
    });
  }

  override params(): Params {
    return {
      actions: [],
      name: "default",
      items: [],
    };
  }
}
