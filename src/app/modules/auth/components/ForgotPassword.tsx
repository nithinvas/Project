import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import {useFormik} from 'formik'
import {requestPassword,resetPassword} from '../core/_requests'

const initialValues = {
  email: '20bcs225@iiitdmj.ac.in',
  code:'',
  password : '',
  changepassword : '',
}

function forgotPasswordSchema(isCodeInput =false){ 
  if (!isCodeInput) {
    return Yup.object().shape({
      email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
    });
  }
  return Yup.object().shape({
    email: Yup.string()
      .email('Wrong email format')
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Email is required'),
      code: Yup.string()
      .required('Code is required')
      .matches(/^\+?[0-9]{6}$/, 'Invalid mobile number'),
      password: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Password is required'),
     changepassword: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Password confirmation is required')
      .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
  });
}


export function ForgotPassword() {
  const [loading, setLoading] = useState(false);
const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
const [showCodeInput, setShowCodeInput] = useState(false);
const navigate = useNavigate();
const formik = useFormik({
  initialValues,
  validationSchema: showCodeInput ? forgotPasswordSchema(true) : forgotPasswordSchema(),
 
  onSubmit: async (values, { setStatus, setSubmitting }) => {
    // console.log("Chekking");
    // console.log(loading);
    setLoading(true);
    setHasErrors(undefined);

    try {
      if(!showCodeInput)
      {
       const response = await requestPassword(values.email);
        if (response.status===200) {
        // Email exists in the database
        //console.log("Chekking");
        setStatus('Code sent successfully!');
        setHasErrors(false);
        setLoading(false);
        
        setShowCodeInput(true);
        formik.setFieldTouched('code', false); // Reset touched state for code
          formik.setFieldError('code', undefined); // Reset error state for code
          
         
        
      } else {
        // Email doesn't exist in the database
        setHasErrors(true);
        setLoading(false);
        setStatus('Email not found in the database');
      }
    }
    else {
      // If showCodeInput is true, call resetPassword function
      const response = await resetPassword(values.email,values.code,values.password);
      // Handle resetResponse as needed
      if (response.status === 200) {
        // Reset successful
        setStatus('Password reset successfully!');
        setHasErrors(false);
        setLoading(false);
        
        navigate('/auth/login');
      } else {
        // Reset failed
        setHasErrors(true);
        setLoading(false);
        setStatus('Password reset failed');
      }
    }
  } catch (error) {
      // Handle any other errors
      setHasErrors(true);
      setLoading(false);
      setStatus('An error occurred during password reset');
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
      id='kt_login_password_reset_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-10'>
        {/* begin::Title */}
        <h1 className='text-gray-900 fw-bolder mb-3'>Forgot Password ?</h1>
        {/* end::Title */}

        {/* begin::Link */}
        <div className='text-gray-500 fw-semibold fs-6'>
          Enter your email to reset your password.
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
          <div className='text-info'>Sent password reset. Please check your email</div>
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



      {/* end::Form group */}

      {showCodeInput && (
        <div>
  <div className='fv-row mb-8'>
    <label className='form-label fw-bolder text-gray-900 fs-6'>
      Verification Code
    </label>
    <input
      type='text'
      placeholder=''
      autoComplete='off'
      {...formik.getFieldProps('code')}
      className={clsx(
        'form-control bg-transparent',
        {'is-invalid': formik.touched.code && formik.errors.code},
        {'is-valid': formik.touched.code && !formik.errors.code}
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


  {/* begin::Form group Password */}
  <div className='fv-row mb-8' data-kt-password-meter='true'>
        <div className='mb-1'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Password</label>
          <div className='position-relative mb-3'>
            <input
              type='password'
              placeholder='Password'
              autoComplete='off'
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.password && formik.errors.password,
                },
                {
                  'is-valid': formik.touched.password && !formik.errors.password,
                }
              )}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.password}</span>
                </div>
              </div>
            )}
          </div>
          {/* begin::Meter */}
          <div
            className='d-flex align-items-center mb-3'
            data-kt-password-meter-control='highlight'
          >
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px'></div>
          </div>
          {/* end::Meter */}
        </div>
        <div className='text-muted'>
          Use 8 or more characters with a mix of letters, numbers & symbols.
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group Confirm password */}
      <div className='fv-row mb-5'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Confirm Password</label>
        <input
          type='password'
          placeholder='Password confirmation'
          autoComplete='off'
          {...formik.getFieldProps('changepassword')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
            },
            {
              'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
            }
          )}
        />
        {formik.touched.changepassword && formik.errors.changepassword && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.changepassword}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}



  </div>
)}



      {/* begin::Form group */}
      <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
        <button type='submit' id='kt_password_reset_submit' className='btn btn-primary me-4'>
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
            id='kt_login_password_reset_form_cancel_button'
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
