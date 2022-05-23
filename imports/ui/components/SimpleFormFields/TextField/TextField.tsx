import React from 'react';
import omit from 'lodash/omit';
import InputBase from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import { createStyles, Theme } from '@mui/material/styles';
import SimpleLabelView from '/imports/ui/components/SimpleLabelView/SimpleLabelView';
import * as appStyle from '/imports/materialui/styles';
import { IBaseSimpleFormComponent } from '../../InterfaceBaseSimpleFormComponent';

interface ITextFieldSimpleFormComponent extends IBaseSimpleFormComponent {
  maxCaracteres?: 'short' | 'medium' | 'long';
  help?: string,
  /**
   *
   * @param value valor que é exibido.
   * @param label nome do campo.
   * @return mensagem justificando valor invalido, ou true para mensagem padrão. Null se válido.
   */
  invalidate?: (value: string | null, label: string) => string | null | true | false;
  /**
   * transforma o dado do documento em string.
   */
  valueFormatter?: (value?: any) => string;

  /**
   *  tranforma o string em dado do documento
   */
  valueTransformer?: (value?: string) => any;

  /**
   * Aplica uma máscara ao valor a ser exibido.
   * @param value
   */
  applyMask?: (value: string) => string;

  /**
   * Se verdadeiro exibe mensagem de erro no componente.
   */
  inlineError?: boolean;
  rows?: number;
  maxRows?: number;
	[otherPropsKey: string]: any;
}

export default ({maxCaracteres, error, help, label, name, readOnly, style, placeholder, value, onChange,
                  valueTransformer = (v) => v,
                  valueFormatter = (v) => v,
                  applyMask = (v) => v,
                  invalidate = () => null,
                  inlineError,
                  ...otherProps
                }: ITextFieldSimpleFormComponent) => {

  const {schema} = otherProps;

  let fieldValue = value === '-' ? '-' : (schema && schema.type === Date && !!value && value instanceof Date ?
    value.toLocaleDateString('pt-BR') : value);

  fieldValue = valueFormatter(fieldValue);
  fieldValue = applyMask(fieldValue);
  const useStyles = makeStyles((theme: Theme) => createStyles({
		root: {
			borderRadius: style ? style.borderRadius : 4,
			backgroundColor: style ? style.backgroundColor : 'white'},
		})
	);

  const classes = useStyles();

	const maxLength = maxCaracteres && maxCaracteres == 'short' ? 100 : (maxCaracteres == 'medium' ? 200 : 400);

	otherProps && maxCaracteres && (
		otherProps.inputProps = otherProps.inputProps ? {...otherProps.inputProps, maxLength: maxLength} : {maxLength: maxLength}
	);

  let validateMsg = invalidate(fieldValue, label);
  error = error || !!validateMsg;

  if (typeof validateMsg !== 'string') {
    validateMsg = null;
  }
  const onFieldChange = (e: React.BaseSyntheticEvent) => {
    const maskedValue = applyMask(e.target.value);
    const newValue = valueTransformer(maskedValue);
		//@ts-ignore
    onChange({name, target: {name, value: newValue}}, {name, value: newValue});
  };

  if (readOnly) {
    return (
      <div
        key={name}
        style={{display: 'flex', flexDirection: 'column', ...appStyle.fieldContainer}}
      >
        {label && !otherProps.rounded ? (
          <SimpleLabelView
            label={label}
            style={style ? style.displayLabel : undefined}
            help={help}
          />
        ) : null}

        <TextField
					variant='outlined'
          InputProps={otherProps.rounded ? {classes: classes} : undefined}
          {...(otherProps)}
          key={name}
          onChange={onFieldChange}
          value={fieldValue}
          error={!!error}
          disabled={!!readOnly}
          id={name}
          name={name}
          label={otherProps.rounded ? label : null}
          type={'text'}
        />
      </div>
    );
  }

  if (otherProps.isNaked) {
    return (
      <InputBase
        key={name}
        onChange={onFieldChange}
        value={fieldValue}
        error={!!error}
        disabled={!!readOnly}
        id={name}
        name={name}
        label={otherProps.labelDisable ? undefined : label}
        {...otherProps}
      />
    );
  }

  return (
    <div
      key={name}
      style={{display: 'flex', flexDirection: 'column', ...appStyle.fieldContainer}}
    >
      {label && !otherProps.rounded ?
        <SimpleLabelView
          label={label}
          help={help}
          style={style ? {displayLabel: style.displayLabel} : undefined}
        />
        : null}

      <TextField
				variant='outlined'
        style={style}
        InputProps={otherProps.rounded || otherProps.field ? {root: classes.root} : undefined}
        {...otherProps}
        key={name}
        onChange={onFieldChange}
        placeholder={placeholder}
        value={fieldValue}
        error={!!error}
        disabled={!!readOnly}
        id={name}
        name={name}
        label={otherProps.rounded ? label : null}
      />

      {inlineError && error &&
        <div style={{width: '100%', textAlign: 'right', margin: 0, padding: 1, color: '#DD0000', fontSize: 10}}>
          {validateMsg || `${label || 'Valor'} inválido!`}
        </div>
      }
    </div>
  );
}
