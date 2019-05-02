import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import {
  EmailFieldItem,
  FieldGroup,
  SubmitButton,
  FormErrors,
  CaptchaLegalMessage,
  FormWithCaptcha,
} from '../form-helpers/form-helpers';
import LanguageSelector from '../shared/LanguageSelector/LanguageSelector';
import { InjectAppServices } from '../../services/pure-di';

const fieldNames = {
  email: 'email',
};

/** Prepare empty values for all fields
 * It is required because in another way, the fields are not marked as touched.
 */
const getFormInitialValues = () =>
  Object.keys(fieldNames).reduce(
    (accumulator, currentValue) => ({ ...accumulator, [currentValue]: '' }),
    {},
  );

/**
 *
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const ForgotPassword = ({ intl, dependencies: { dopplerLegacyClient } }) => {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const result = await dopplerLegacyClient.sendResetPasswordEmail({
        email: values[fieldNames.email],
        captchaResponseToken: values['captchaResponseToken'],
      });

      if (result.success) {
        // TODO: show OK message
      } else {
        console.log('Unexpected error', result);
        setErrors({ _general: 'validation_messages.error_unexpected' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="panel-wrapper">
      <article className="main-panel">
        <header>
          <h1 className="logo-doppler-new">Doppler</h1>
          <LanguageSelector />
        </header>
        <h5>{_('login.forgot_password')}</h5>
        <p className="content-subtitle">{_('forgot_password.description')}</p>
        <p className="content-subtitle">{_('forgot_password.description2')}</p>
        <p className="content-subtitle">
          {_('login.you_want_create_account')}{' '}
          <Link to="/signup" className="link--title">
            {_('login.signup')}
          </Link>
        </p>
        <FormWithCaptcha
          className="login-form"
          initialValues={getFormInitialValues()}
          onSubmit={onSubmit}
        >
            <fieldset>
              <FieldGroup>
                <EmailFieldItem
                  fieldName={fieldNames.email}
                  label={_('signup.label_email')}
                  required
                  placeholder={_('signup.placeholder_email')}
                />
              </FieldGroup>
            </fieldset>
            <fieldset>
              <FormErrors />
              <SubmitButton>{_('login.button_login')}</SubmitButton>
              <Link to="/login" className="forgot-link">
                <span className="triangle-right" />
                {_('forgot_password.back_login')}
              </Link>
            </fieldset>
        </FormWithCaptcha>
        <footer>
          <CaptchaLegalMessage />
          <p>
            <FormattedHTMLMessage
              tagName="small"
              id="common.copyright_HTML"
              values={{ year: new Date().getFullYear() }}
            />
          </p>
        </footer>
      </article>
      <section className="feature-panel bg--forgot">
        <article className="feature-content">
          <h6>{_('feature_panel.forms')}</h6>
          <h1>{_('feature_panel.forms_description')}</h1>
          <p>{_('feature_panel.forms_remarks')}</p>
        </article>
      </section>
    </main>
  );
};

export default InjectAppServices(injectIntl(ForgotPassword));
