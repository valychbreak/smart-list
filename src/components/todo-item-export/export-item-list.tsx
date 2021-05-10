import ExportItem from "./export-item";
import ExportItemView from "./export-item-view";

type ExportItemListProps = {
    exportItems: ExportItem[];
    onEdit: (exportItem: ExportItem) => void;
};

const ExportItemList = (props: ExportItemListProps) => {
    const { exportItems, onEdit } = props;

    return (<>
        {exportItems.map((exportItem) => (
            <ExportItemView
                key={exportItem.id}
                exportItem={exportItem}
                onEdit={onEdit}
            />
        ))}
    </>);
};

export default ExportItemList;
