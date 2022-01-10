import React from 'react';
import { FieldHookConfig, useField } from 'formik';


const OptionalField = (
    props: {
        className?: string
    } & FieldHookConfig<any>
) => {

    const [field, meta, helpers] = useField(props);

    return (
      <input
        className={props.className}
        {...field}
        type={props.type}
        value={meta.initialValue ?? ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {

            if (props.type === 'checkbox' || props.type === 'radio') {
                helpers.setValue(e.target.checked);
            }

            else {
                const result = e.target.value;
                if (result) {
                    helpers.setValue(result);
                }
                else {
                    helpers.setValue(undefined);
                }
            }
        }}
      />
    );
}

export default OptionalField;