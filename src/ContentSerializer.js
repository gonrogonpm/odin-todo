import { TextBlock } from "./contents/TextBlock";
import { Checklist } from "./contents/Checklist";

export function deserializeContent(json) {
    switch (json.type) {
        case TextBlock.getType(): return TextBlock.deserialize(json);
        case Checklist.getType(): return Checklist.deserialize(json);
    }

    console.error(`Invalid contenxt type "${json.type}"`);
    return null;
}