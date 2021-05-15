import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import ExportItem from "./export-item";
import { ExportItemsGrouped } from "./todo-item-export";

type ExportResultViewProps = {
    exportItemsGrouped: ExportItemsGrouped[];
};

function totalSum(exportItems: ExportItem[]): number {
    return exportItems.map((exportItem) => {
        const price = exportItem.purchasedPrice || 0;
        return price * exportItem.quantity;
    }).reduce((previousValue, currentValue) => previousValue + currentValue);
}

function ccyFormat(number: number) {
    return number.toFixed(2);
}

const ExportResultView = (props: ExportResultViewProps) => {
    const { exportItemsGrouped } = props;

    return (<>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Store</TableCell>
                        <TableCell>Spent</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {exportItemsGrouped.map((exportItemGroup, idx) => (
                        <TableRow key={idx}>
                            <TableCell>
                                {exportItemGroup.categoryName}
                            </TableCell>
                            <TableCell>
                                {exportItemGroup.storeName}
                            </TableCell>
                            <TableCell align="right">
                                {ccyFormat(totalSum(exportItemGroup.exportItems))} PLN
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>);
};

export default ExportResultView;
