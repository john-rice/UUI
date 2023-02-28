import React, { useState } from 'react';
import { UploadFileToggler, FlexSpacer } from '@epam/uui-components';
import { IModal, prependHttp, uuiSkin } from '@epam/uui-core';
import { insertData, PlateEditor } from '@udecode/plate';

import css from './AddImageModal.scss';

const {
    LabeledInput,
    ModalBlocker,
    ModalWindow,
    ModalHeader,
    FlexRow,
    TextInput,
    ModalFooter,
    Button,
} = uuiSkin;

interface AddImageModalProps extends IModal<any> {
    insertImage: (imageURL: string) => void;
    focusEditor: () => void;
    editor: PlateEditor;
}

export function AddImageModal(props: AddImageModalProps): JSX.Element {
    const { focusEditor, abort } = props;

    const [imageURL, setImageURL] = useState(null);
    const [files, setFiles] = useState([]);

    return (
        <ModalBlocker { ...props }>
            <ModalWindow >
                <ModalHeader title="Add image" onClose={ abort } />
                <FlexRow cx={ css.inputWrapper }>
                    <LabeledInput  label='Image url' >
                        <TextInput value={ imageURL }  onValueChange={ (newVal) => setImageURL(newVal) } autoFocus />
                    </LabeledInput>
                </FlexRow>
                <ModalFooter borderTop >
                    <UploadFileToggler
                        render={ (props) => <Button { ...props } caption='Select file' /> }
                        onFilesAdded={ (acceptedFiles: any) => {
                            setImageURL(acceptedFiles[0].name);
                            setFiles(acceptedFiles);
                        } }
                        accept='image/*'
                    />
                    <FlexSpacer />
                    <Button type='cancel' caption='Cancel' onClick={ abort } />
                    <Button type='success' caption='Ok' isDisabled={ !imageURL } onClick={ () => {
                        focusEditor();

                        if (files && files.length) {
                            const dataTransfer = new DataTransfer();

                            files.map((file: File) => {
                                dataTransfer.items.add(file);
                            });

                            insertData(props.editor, dataTransfer);
                        } else {
                            props.insertImage(prependHttp(imageURL, { https: true }));
                        }
                        props.success(true);
                    } }
                    />
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );

}
