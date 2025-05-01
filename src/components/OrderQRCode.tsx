
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/components/ui/use-toast";
import { QRCodeSVG } from "qrcode.react";

interface OrderQRCodeProps {
  orderId: string;
  onClose?: () => void;
}

const OrderQRCode: React.FC<OrderQRCodeProps> = ({ orderId, onClose }) => {
  const [qrValue, setQrValue] = useState<string>("");
  const { useToken } = useSubscription();
  const { toast } = useToast();
  
  useEffect(() => {
    // Create a value that encodes the order ID and a timestamp for validation
    const timestamp = new Date().getTime();
    const qrData = JSON.stringify({
      orderId,
      timestamp,
      type: "campus-bite-order"
    });
    
    // In a real app, you might want to encrypt this data
    setQrValue(qrData);
  }, [orderId]);
  
  const handleTokenUsed = async () => {
    // This function simulates scanning the QR code and using a token
    // In a real app, this would be done by the delivery person's scanner
    const success = await useToken();
    
    if (success) {
      toast({
        title: "Token redeemed",
        description: "Your meal token has been used for this order. Enjoy your meal!",
      });
      if (onClose) onClose();
    }
  };
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Scan to Redeem Your Meal</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-lg mb-4">
          <QRCodeSVG 
            value={qrValue} 
            size={200} 
            level="H"
            includeMargin
            imageSettings={{
              src: "/logo.png",
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>
        <p className="text-sm text-gray-500 text-center mb-4">
          Show this QR code to the delivery person to receive your meal.
          They will scan it to deduct a token from your account.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          onClick={handleTokenUsed}
          className="w-full bg-campus-green hover:bg-campus-green/90"
        >
          Simulate QR Scan
        </Button>
        {onClose && (
          <Button 
            onClick={onClose}
            variant="outline" 
            className="w-full"
          >
            Close
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OrderQRCode;
