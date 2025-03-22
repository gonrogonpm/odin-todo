import { TextBlock } from "./contents/TextBlock";
import { Checklist } from "./contents/Checklist";

export function deserializeContent(json) {
    switch (json.type) {
        case "TextBlock": return TextBlock.deserialize(json);
        case "Checklist": return Checklist.deserialize(json);
    }

    console.error("Invalid contenxt type");
    return null;
}