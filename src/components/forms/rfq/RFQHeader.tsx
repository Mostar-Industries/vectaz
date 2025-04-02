
import React from 'react';
import { format } from 'date-fns';

interface RFQHeaderProps {
  companyName?: string;
}

const RFQHeader: React.FC<RFQHeaderProps> = ({ companyName = "NAIROBI HUB" }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#00FFD1]">{companyName}</h2>
          <p className="text-sm text-gray-400">Request for Quotation</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">RFQ #: NBO-{format(new Date(), 'yyyyMMdd')}-01</div>
          <div className="text-sm text-gray-400">Date: {format(new Date(), 'MMM dd, yyyy')}</div>
        </div>
      </div>
      
      <div className="border-b border-[#00FFD1]/20 mb-6 pb-2">
        <p className="text-xs text-gray-400 italic">
          This form is designed to obtain competitive quotes from vendors for project goods and services.
          The form is important to assist vendor hub in making necessary decisions regarding contractors.
        </p>
      </div>
    </>
  );
};

export default RFQHeader;
