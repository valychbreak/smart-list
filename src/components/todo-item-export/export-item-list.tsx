import ExportItem from "./export-item";
import ExportItemView from "./export-item-view";

type ExportItemListProps = {
    exportItems: ExportItem[];
};

const ExportItemList = (props: ExportItemListProps) => {
    const { exportItems } = props;

    return (<>
        {exportItems.map((exportItem) => (
            <ExportItemView
                key={exportItem.id}
                exportItem={exportItem} />
        ))}
    </>);
};

export default ExportItemList;
