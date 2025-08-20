require('dotenv').config();
import axios from 'axios';
import { customAlphabet } from 'nanoid'

interface SendSmsOptions {
  to: string;
  message: string;
}

export async function sendSms({ to, message }: SendSmsOptions) {
  const PISIMOB_BASEURL = process.env.PISIMOB_BASEURL || 'https://api.pisimobile.net';
  const PISISID = process.env.PISISID || '247';

  axios.defaults.headers.common['Content-Type'] = 'String';
  axios.defaults.headers.common['vaspid'] = process.env.VASPID || '2';
  // Dynamically set the authorization token later from function, cause it might change
  axios.defaults.headers.common['pisi-authorization-token'] = `Bearer ${process.env.PISI_AUTHORIZATION_TOKEN}`;

  const payload = {
    pisisid: PISISID,
    msisdn: to, // Assuming 'to' is the MSISDN (phone number) 
    to,
    message,
    trxid: generateTrxId(), // Generate a unique transaction ID
  };

  try {
    const response = await axios.post(`${PISIMOB_BASEURL}/v1/sms/outbound/send`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

function generateTrxId() {
  // Generate a unique transaction ID, e.g., using a timestamp or UUID
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10)
  return `brain-teaser_${nanoid(5)}${Date.now()}`;
}

export async function subscribeListener(callbackUrl: string) {
  // register a handler/callback URL in order to receive Mobile Originated messages from Subscribers
  const PISIMOB_BASEURL = process.env.PISIMOB_BASEURL
  const PISIPID = process.env.PISIPID

  axios.defaults.headers.common['Content-Type'] = 'String';
  axios.defaults.headers.common['vaspid'] = process.env.VASPID || '2';
  // Dynamically set the authorization token later from function, cause it might change
  axios.defaults.headers.common['pisi-authorization-token'] = `Bearer ${process.env.PISI_AUTHORIZATION_TOKEN}`;

  const payload = {
    pisipid: PISIPID,
    notifyUrl: callbackUrl, // url that will be called by pisi
    method: "POST",
    type: "MO",  // MO or DLR
    trxid: generateTrxId(), // Generate a unique transaction ID
  };

  try {
    const response = await axios.post(`${PISIMOB_BASEURL}/v1/sms/inbound/subscribe`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function deleteListener(callbackUrl: string, trxid: string) {
  // register a handler/callback URL in order to receive Mobile Originated messages from Subscribers
  const PISIMOB_BASEURL = process.env.PISIMOB_BASEURL
  const PISIPID = process.env.PISIPID

  axios.defaults.headers.common['Content-Type'] = 'String';
  axios.defaults.headers.common['vaspid'] = process.env.VASPID || '2';
  // Dynamically set the authorization token later from function, cause it might change
  axios.defaults.headers.common['pisi-authorization-token'] = `Bearer ${process.env.PISI_AUTHORIZATION_TOKEN}`;

  const payload = {
    pisipid: PISIPID,
    notifyUrl: callbackUrl, // url that will be called by pisi
    method: "POST",
    type: "MO",  // MO or DLR
    trxid
  };

  try {
    const response = await axios.post(`${PISIMOB_BASEURL}/v1/sms/inbound/delete`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
}
/*
Just stashing this to show how an axios request with auth might look like
const auth = {
    username: USERNAME,
    password: PASSWORD,
  };
const response = await axios.post(`${PISIMOB_BASEURL}/v1/sms/outbound/send`, payload, { auth });
*/