import { Button } from '@/components/ui/button';
import { cn } from '@/utils/helpers';
import { ConnectButton as RainbowConnect } from '@rainbow-me/rainbowkit';
import { Wallet } from 'lucide-react';
export const ConnectButton = ({ className }: { className?: string }) => {
  return (
    <RainbowConnect.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');
        return (
          <>
            {(() => {
              if (!connected) {

                return (
                  <Button
                    onClick={openConnectModal}
                    variant={"ripple"}
                    className={cn("font-medium text-xs", className)}
                  >
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </Button>

                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant={"ripple"}
                    className={cn("font-medium text-xs", className)}
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <Button
                  onClick={openAccountModal}
                  className={cn("font-medium text-xs", className)}
                  variant={"ripple"}
                >
                  <Wallet className="h-4 w-4" />

                  {account.displayName}
                </Button>
              );
            })()}
          </>
        );
      }}
    </RainbowConnect.Custom>
  );
};