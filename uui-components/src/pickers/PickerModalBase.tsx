import {
    DataSourceState, IHasCaption, IModal, Lens, PickerBaseProps, PickerFooterProps,
} from '@epam/uui-core';
import { PickerModalOptions } from './hooks';
import { PickerBase, PickerBaseState } from './PickerBase';

export type PickerModalImplProps<TItem, TId> = PickerBaseProps<TItem, TId> & IModal<any> & IHasCaption & PickerModalOptions<TItem, TId>;

interface PickerModalState extends PickerBaseState {
    showSelected: boolean;
}

const initialStateValues: DataSourceState = {
    topIndex: 0,
    visibleCount: 30,
    focusedIndex: -1, // we don't want to focus the 1st item from the start, as it confuses and people would rarely use keyboard in modals
};

export class PickerModalBase<TItem, TId> extends PickerBase<TItem, TId, PickerModalImplProps<TItem, TId>, PickerModalState> {
    stateLens = Lens.onState<PickerBaseState & PickerModalState>(this);
    showSelectionLens = this.stateLens
        .onChange((oldVal, newVal) => ({
            ...newVal,
            dataSourceState: {
                ...newVal.dataSourceState,
                ...initialStateValues,
            },
        }))
        .prop('showSelected');

    getInitialState() {
        const base = super.getInitialState();
        return {
            ...base,
            dataSourceState: {
                ...base.dataSourceState,
                ...initialStateValues,
            },
        };
    }

    getRows() {
        const view = this.getView();
        const { topIndex, visibleCount } = this.state.dataSourceState;
        return this.state.showSelected ? view.getSelectedRows({ topIndex, visibleCount }) : view.getVisibleRows();
    }

    getFooterProps(): PickerFooterProps<TItem, TId> & Partial<IModal<any>> {
        const footerProps = super.getFooterProps();

        return {
            ...footerProps,
            success: this.props.success,
            abort: this.props.abort,
        };
    }
}
