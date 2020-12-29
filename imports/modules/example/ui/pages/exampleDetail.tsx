import React from 'react';
import {withTracker} from "meteor/react-meteor-data";
import {exampleApi} from "../../api/exampleApi";
import SimpleForm from "../../../../ui/components/SimpleForm/SimpleForm";
import SimpleImageUploadBase64 from "../../../../ui/components/SimpleFormFields/ImageUpload/SimpleImageUploadBase64";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '../../../../ui/components/SimpleFormFields/TextField/TextField';
import TextMaskField from '../../../../ui/components/SimpleFormFields/TextMaskField/TextMaskField';
import DatePickerField from '../../../../ui/components/SimpleFormFields/DatePickerField/DatePickerField';
import SelectField from '../../../../ui/components/SimpleFormFields/SelectField/SelectField';
import UploadFilesCollection from '../../../../ui/components/SimpleFormFields/UploadFiles/uploadFilesCollection';
import ChipInput from '../../../../ui/components/SimpleFormFields/ChipInput/ChipInput';


// import UploadFilesCollection from "/imports/ui/components/UploadFiles/uploadFilesCollection";

interface IExampleDetail {
    screenState: string;
    loading: boolean;
    exampleDoc: object;
    save: { (doc: object, callback?: {}): void };
    history: { push(url: string): void };
}

const ExampleDetail = ({screenState, loading, exampleDoc, save, history}: IExampleDetail) => {

    const handleSubmit = (doc: object) => {
        console.log('DOC',doc);
        save(doc);
    }

    return (
        <Container>
            <h1>{screenState === 'view' ? 'Visualizar exemplo' : (screenState === 'edit' ? 'Editar Exemplo' : 'Criar exemplo')}</h1>
            <SimpleForm
                mode={screenState}
                schema={exampleApi.schema}
                doc={exampleDoc}
                onSubmit={handleSubmit}
                loading={loading}
            >

                <SimpleImageUploadBase64
                    label={'Imagem'}
                    name={'image'}
                />
                <FormGroup key={'fields'}>
                    <TextField
                        placeholder='Titulo'
                        name='title'
                    />
                    <TextField
                        placeholder='Descrição'
                        name='description'
                    />
                </FormGroup>
                <FormGroup key={'fields'}>
                    <SelectField
                        placeholder='Tipo'
                        options={[
                            {value:'normal',label:'Normal'},
                            {value:'extra',label:'Extra'},
                        ]}
                        name='type'
                    />
                    <DatePickerField
                        placeholder='Data'
                        name='date'
                    />
                </FormGroup>
                <FormGroup key={'fields'} formType={'subform'} name={'contacts'}>
                    <TextMaskField
                        placeholder='Telefone'
                        name='phone'
                    />
                    <TextMaskField
                        placeholder='Celular'
                        name='celphone'
                    />
                </FormGroup>
                <FormGroup key={'fields'} formType={'subformArray'} name={'tasks'}>
                    <TextField
                        placeholder='Nome da Tarefa'
                        name='name'
                    />
                    <TextField
                        placeholder='Descrição da Tarefa'
                        name='description'
                    />
                </FormGroup>
                <UploadFilesCollection
                    name='files'
                    label={'Arquivos'}
                    doc={exampleDoc}/>
                <FormGroup key={'fields'} name={'chips'}>
                    <ChipInput
                        name="chip"
                        placeholder="Chip"
                    />
                </FormGroup>
                <div key={'Buttons'}>
                    <Button
                        key={'b1'}
                        onClick={screenState === 'edit' ? () => history.push(`/example/view/${exampleDoc._id}`) : () => history.push(`/example/list`)}
                        color={'secondary'} variant="contained">
                        {screenState === 'view' ? 'Voltar' : 'Cancelar'}
                    </Button>

                    {screenState === 'view' ? (
                        <Button key={'b2'} onClick={() => history.push(`/example/edit/${exampleDoc._id}`)}
                                color={'primary'} variant="contained">
                            {'Editar'}
                        </Button>
                    ) : null}
                    {screenState !== 'view' ? (
                        <Button key={'b3'} color={'primary'} variant="contained" submit>
                            {'Salvar'}
                        </Button>
                    ) : null}
                </div>
            </SimpleForm>

        </Container>
    )
}

interface IExampleDetailContainer {
    screenState: string;
    id: string;
    history: { push(url: string): void };
    showSnackBar: (data: { type: string, title: string, description: string }) => void;
}

export const ExampleDetailContainer = withTracker((props: IExampleDetailContainer) => {
    const {screenState, id} = props;
    const subHandle = exampleApi.subscribe('default', {_id: id});
    const exampleDoc = subHandle.ready() ? exampleApi.findOne({_id: id}) : {}

    return ({
        screenState,
        exampleDoc,
        save: (doc, callback) => exampleApi.upsert(doc, (e, r) => {
            if (!e) {
                props.history.push(`/example/view/${screenState === 'create' ? r : doc._id}`)
                props.showSnackBar({
                    type: 'success',
                    title: 'Operação realizada!',
                    message: `O exemplo foi ${doc._id ? 'atualizado' : 'cadastrado'} com sucesso!`,
                })
            } else {
                console.log('Error:', e);
                props.showSnackBar({
                    type: 'error',
                    title: 'Operação não realizada!',
                    message: `Erro ao realizar a operação: ${e.message}`,
                })
            }

        }),
    })
})(ExampleDetail)
