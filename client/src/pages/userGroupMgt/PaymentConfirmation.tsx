/* eslint-disable react-refresh/only-export-components */
import {
  LoaderFunctionArgs,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { extractParams, queryClient } from '../../helperFunc.ts/apiRequest';
import { fetchPayment } from '../../helperFunc.ts/contributionsRequest';
import { useQuery } from '@tanstack/react-query';
import { formatDate, formatNumber } from '../../helperFunc.ts/utilsFunc';
import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  heading,
  img,
  lineBox,
  topDiv,
} from '../../helperFunc.ts/ReceiptStyle';
import { CSSProperties } from 'react';
import logo from '../../assets/logo-no-bg.png';

const PaymentConfirmation = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ['verify-payment'],
    queryFn: () => fetchPayment(reference as string),
  });

  const payment = data?.data?.data;

  const generatePDF = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, { scale: 5 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('receipt.pdf');
    }
  };

  return (
    <>
      {/* For pdf generation */}
      <div ref={receiptRef} style={topDiv as CSSProperties}>
        <div style={img}>
          <img src={logo} alt='' width={50} height={50} />
        </div>
        <h3 style={heading as CSSProperties}>
          {payment.metadata.contributionName}
        </h3>
        <div style={lineBox as CSSProperties}>
          <span>Transaction Type: </span>
          <span>{payment.metadata.transactionType}</span>
        </div>
        <div style={lineBox as CSSProperties}>
          <span>Amount Paid: </span>
          <span>{formatNumber(payment?.amount / 100)}</span>
        </div>
        <div style={lineBox as CSSProperties}>
          <span>Reference: </span>
          <span>{payment.reference}</span>
        </div>
        <div style={lineBox as CSSProperties}>
          <span>Description: </span>
          <span>{payment.metadata.description}</span>
        </div>
        <div style={lineBox as CSSProperties}>
          <span>Date: </span>
          <span>{formatDate(new Date(payment.createdAt))}</span>
        </div>
      </div>

      {/* To be displayed to users */}
      <div className='bg-[#e2e8f0] dark:bg-[#45556c] p-5 font-poppins text-sm shadow-2xl rounded-lg'>
        {/* <h3>{payment.contributionName}</h3> */}
        <h3
          className='font-600 text-[16px] capitalize underline text-center lg:leading-1 mb-3'
          style={{ textTransform: 'capitalize' }}
        >
          {payment.metadata.contributionName}
        </h3>
        <div className='flex flex-wrap justify-between items-center capitalize mt-2'>
          <span>Transaction Type: </span>
          <span>{payment.metadata.transactionType}</span>
        </div>
        <div className='flex flex-wrap justify-between items-center capitalize mt-2'>
          <span>Amount Paid: </span>
          <span>{formatNumber(payment?.amount / 100)}</span>
        </div>
        <div className='flex flex-wrap justify-between items-center capitalize mt-2'>
          <span>Reference: </span>
          <span>{payment.reference}</span>
        </div>
        <div className='flex flex-wrap justify-between items-center capitalize mt-2'>
          <span>Description: </span>
          <span>{payment.metadata.description}</span>
        </div>
        <div className='flex flex-wrap justify-between items-center capitalize mt-2'>
          <span>Date: </span>
          <span>{formatDate(new Date(payment.createdAt))}</span>
        </div>

        <button
          onClick={generatePDF}
          className='bg-[#199647] hover:bg-[#05df72] px-3 py-2 rounded-md w-full capitalize text-[#f1f5f9] font-600 cursor-pointer disabled:bg-[#99a1af] mt-2'
        >
          Downlaod Receipt
        </button>

        <button
          onClick={() =>
            navigate(`/account/manage-group/view/${params.groupId}`)
          }
          className='bg-[#ccd7d0] hover:bg-[#4b7d64] px-3 py-2 rounded-md w-full capitalize text-[#3c4145] font-600 cursor-pointer disabled:bg-[#99a1af] mt-2'
        >
          Return to Contribution
        </button>
      </div>
    </>
  );
};

export default PaymentConfirmation;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { reference } = extractParams(request);

  return queryClient.ensureQueryData({
    queryKey: ['verify-payment'],
    queryFn: () => fetchPayment(reference),
  });
};
