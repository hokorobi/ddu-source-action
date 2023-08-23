import {
  ActionFlags,
  Actions,
  BaseKind,
  DduItem,
} from "https://deno.land/x/ddu_vim@v3.5.1/types.ts";
import { Denops } from "https://deno.land/x/ddu_vim@v3.5.1/deps.ts";

export type ActionData = {
  action: string;
  name: string;
  items: DduItem[];
};

type Params = Record<string, never>;

export class Kind extends BaseKind<Params> {
  override actions: Actions<Params> = {
    do: async (args: {
      denops: Denops;
      items: DduItem[];
      kindParams: Params;
      actionParams: unknown;
    }) => {
      const name = (args.items[0].action as ActionData).name;

      await args.denops.dispatcher.pop(name, {
        quit: false,
        sync: true,
      });
      await args.denops.dispatcher.event(name, "close");

      for (const item of args.items) {
        const action = item?.action as ActionData;
        await args.denops.call(
          "ddu#ui_sync_action",
          action.name,
          "itemAction",
          {
            name: action.action,
            items: action.items,
            params: args.actionParams,
          },
        );
      }

      return Promise.resolve(ActionFlags.None);
    },
  };

  override params(): Params {
    return {};
  }
}
