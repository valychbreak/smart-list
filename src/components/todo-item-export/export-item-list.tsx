import { Box } from "@material-ui/core";
import ExportItem from "./export-item";
import ExportItemView from "./export-item-view";

type ExportItemListProps = {
    exportItems: ExportItem[];
    onEdit: (exportItem: ExportItem) => void;
};

const ExportItemList = (props: ExportItemListProps) => {
    const { exportItems, onEdit } = props;

    return (
        <Box padding={1}>
            {exportItems.map((exportItem) => (
                <ExportItemView
                    key={exportItem.id}
                    exportItem={exportItem}
                    onEdit={onEdit}
                />
            ))}
        </Box>
    );
};

export default ExportItemList;
