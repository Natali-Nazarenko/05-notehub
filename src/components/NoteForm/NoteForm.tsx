import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
import { useId } from 'react';

import { createNote } from '../../services/noteService';
import css from './NoteForm.module.css';

interface NoteFormValues {
    title: string;
    content: string;
    tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

const INITIAL_VALUES: NoteFormValues = {
    title: '',
    content: '',
    tag: 'Todo',
};

interface NoteFormProps {
    onClose: () => void;
}

const NoteSchema = Yup.object({
    title: Yup.string()
        .min(3, 'Title must be at least 3 characters')
        .max(50, 'Title must be at most 50 characters')
        .required('Title is required'),
    content: Yup.string().max(500),
    tag: Yup.string()
        .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Tag is not valid')
        .required(),
});

function NoteForm({ onClose }: NoteFormProps) {
    const fieldId = useId();

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            onClose();
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
        onError: error => {
            console.error(error);
        },
    });

    const handleSubmit = (values: NoteFormValues, formikHelpers: FormikHelpers<NoteFormValues>) => {
        mutate(values);
        formikHelpers.resetForm();
    };

    return (
        <Formik
            initialValues={INITIAL_VALUES}
            validationSchema={NoteSchema}
            onSubmit={handleSubmit}
        >
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-title`}>Title</label>
                    <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
                    <ErrorMessage name="title" component="span" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-content`}>Content</label>
                    <Field
                        as="textarea"
                        id={`${fieldId}-content`}
                        name="content"
                        rows={8}
                        className={css.textarea}
                    />
                    <ErrorMessage name="content" component="span" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="tag">Tag</label>
                    <Field as="select" id="tag" name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage name="tag" component="span" className={css.error} />
                </div>

                <div className={css.actions}>
                    <button type="button" className={css.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className={css.submitButton} disabled={false}>
                        Create note
                    </button>
                </div>
            </Form>
        </Formik>
    );
}

export default NoteForm;
