import React, { useState, useEffect } from 'react'
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Button,
  Divider,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { commerce } from '../../../lib/commerce'
import useStyles from './styles'
import AddressForm from '../AddressForm'
import PaymentForm from '../PaymentForm'
const steps = ['Shipping address', 'Payment details']
const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [checkoutToken, setCheckoutToken] = useState(null)
  const [shippingData, setShippingData] = useState({})
  const classes = useStyles()
  useEffect(() => {
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, {
          type: 'cart',
        })

        setCheckoutToken(token)
      } catch (error) {
        console.log(error)
      }
    }
    generateToken()
  }, [cart])
  const test = (data) => {
    setShippingData(data)

    nextStep()
  }

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

  const next = (data) => {
    setShippingData(data)
    nextStep()
  }
  let Confirmation = () =>
    order.customer ? (
      <div>
        <Typography variant='h5'>
          Thank you for you purchase, {order.customer.firstname}{' '}
          {order.customer.lastname}
        </Typography>
        <Divider className={classes.divider} />
        <Typography variant='subtitle2'>
          {' '}
          Order ref: {order.customer.reference}
        </Typography>
        <br />
        <Button component={Link} to='/' variant='outlined' type='Button'>
          Back To Home
        </Button>
      </div>
    ) : (
      <div className={classes.spinner}>
        <CircularProgress />
      </div>
    )
  if (error)
    <div>
      <Typography variant='h5'> Error: {error}</Typography>
      <br />
      <Button component={Link} to='/' variant='outlined' type='button'>
        Back To Home
      </Button>
    </div>

  const Form = () =>
    activeStep === 0 ? (
      <AddressForm checkoutToken={checkoutToken} test={test} />
    ) : (
      <PaymentForm
        shippingData={shippingData}
        nextStep={nextStep}
        backStep={backStep}
        checkoutToken={checkoutToken}
        onCaptureCheckout={onCaptureCheckout}
      />
    )

  return (
    <div>
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant='h4'>Checkout</Typography>
          <Stepper active={0} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Confirmation />
          ) : (
            checkoutToken && <Form />
          )}
        </Paper>
      </main>
    </div>
  )
}

export default Checkout
