import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import {useFormik} from 'formik'
import {verifyemailid} from '../core/_requests'



const VerifyEmailSchema = Yup.object().shape({
    email: Yup.string()
      .email('Wrong email format')
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Email is required'),
    code: Yup.string()
      .required('Code is required')
      .matches(/^\d{6}$/, 'Code must be exactly 6 digits'),
  })


  export function VerifyEmail({ email }: { email: string }) {
    const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const navigate = useNavigate();
  //const [showCodeInput, setShowCodeInput] = useState(false);
  
  const formik = useFormik({
    initialValues: {
        email: email || '',  // Set the default value for email field
        code: '',
      },
    validationSchema: VerifyEmailSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);
  
      try {
        const response = await verifyemailid(values.email,values.code)
        if (response.status===200) {
          // Email exists in the database
          setHasErrors(false);
          setLoading(false);
          navigate('/auth/login');
          //setStatus('Code sent successfully!');
          
          
        } else {
          // Email doesn't exist in the database
          setHasErrors(true);
          setLoading(false);
          //setStatus('Email not found in the database');
        }
      } catch (error) {
        // Handle any other errors
        setHasErrors(true);
        setLoading(false);
        //setStatus('An error occurred during password reset');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });


  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_email_verify_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-10'>
        {/* begin::Title */}
        <h1 className='text-gray-900 fw-bolder mb-3'>Verify ?</h1>
        {/* end::Title */}

        {/* begin::Link */}
        <div className='text-gray-500 fw-semibold fs-6'>
          Enter your email to verify.
        </div>
        {/* end::Link */}
      </div>

      {/* begin::Title */}
      {hasErrors === true && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>
            Sorry, looks like there are some errors detected, please try again with correct email.
          </div>
        </div>
      )}

      {hasErrors === false && (
        <div className='mb-10 bg-light-info p-8 rounded'>
            
          <div className='text-info'>Verify Success</div>
        </div>
      )}
      {/* end::Title */}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Email</label>
        <input
          type='email'
          placeholder=''
          autoComplete='off'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.email && formik.errors.email},
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>


      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Code</label>
        <input
          type='text'
          placeholder=''
          autoComplete='off'
          {...formik.getFieldProps('code')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.code && formik.errors.code},
            {
              'is-valid': formik.touched.code && !formik.errors.code,
            }
          )}
        />
        {formik.touched.code && formik.errors.code && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.code}</span>
            </div>
          </div>
        )}
      </div>



      {/* end::Form group */}

    



      {/* begin::Form group */}
      <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
        <button type='submit' id='kt_email_verify_form' className='btn btn-primary me-4'>
          <span className='indicator-label'>Submit</span>
          {loading && (
            <span className='indicator-progress'>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_email_verify_form_cancel_button'
            className='btn btn-light'
            disabled={formik.isSubmitting || !formik.isValid}
          >
            Cancel
          </button>
        </Link>{' '}
      </div>
      {/* end::Form group */}
    </form>
  )
}

export default VerifyEmail;