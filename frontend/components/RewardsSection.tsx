import { useState } from 'react';
import { Trophy, Gift, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RewardsSectionProps {
  userPoints: number;
  onRedeemReward?: (rewardId: string) => void;
}

const rewards = [
  {
    id: 'voucher-100',
    title: 'Pet Store Voucher',
    description: '$10 voucher for pet supplies',
    pointsCost: 1000,
    icon: Gift,
    available: true
  },
  {
    id: 'badge-500',
    title: 'Animal Hero Badge',
    description: 'Digital badge for your profile',
    pointsCost: 500,
    icon: Star,
    available: true
  },
  {
    id: 'premium-2000',
    title: 'Premium Features',
    description: '1 month premium access',
    pointsCost: 2000,
    icon: Zap,
    available: true
  }
];

export default function RewardsSection({ userPoints, onRedeemReward }: RewardsSectionProps) {
  const [redeeming, setRedeeming] = useState<string | null>(null);

  const handleRedeem = async (rewardId: string) => {
    setRedeeming(rewardId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onRedeemReward) {
        onRedeemReward(rewardId);
      }
      
      // Show success message (you can replace this with your toast system)
      alert('Reward redeemed successfully!');
    } catch (error) {
      alert('Failed to redeem reward. Please try again.');
    } finally {
      setRedeeming(null);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Trophy className="w-5 h-5" />
          Rewards & Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Points Display */}
        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Your Points</p>
              <p className="text-3xl font-bold text-purple-600">{userPoints}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Level</p>
              <p className="text-xl font-semibold text-purple-600">
                {userPoints >= 2000 ? 'Gold' : userPoints >= 1000 ? 'Silver' : 'Bronze'}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Current Level</span>
              <span>{userPoints >= 2000 ? 'Max Level' : `${userPoints}/2000`}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((userPoints / 2000) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Available Rewards */}
        <div className="space-y-3">
          <h4 className="font-semibold text-purple-800">Available Rewards</h4>
          {rewards.map((reward) => {
            const Icon = reward.icon;
            const canAfford = userPoints >= reward.pointsCost;
            const isRedeeming = redeeming === reward.id;
            
            return (
              <div 
                key={reward.id}
                className={`bg-white rounded-lg p-3 border ${canAfford ? 'border-green-200' : 'border-gray-200'} ${!canAfford && 'opacity-60'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${canAfford ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Icon className={`w-4 h-4 ${canAfford ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{reward.title}</h5>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-purple-600">{reward.pointsCost} pts</p>
                    <Button
                      size="sm"
                      variant={canAfford ? "default" : "secondary"}
                      disabled={!canAfford || isRedeeming}
                      onClick={() => handleRedeem(reward.id)}
                      className="mt-1"
                    >
                      {isRedeeming ? (
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                          Redeeming...
                        </span>
                      ) : canAfford ? (
                        'Redeem'
                      ) : (
                        'Insufficient'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievement Tips */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <h5 className="font-medium text-blue-800 mb-2">💡 How to Earn More Points</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Report animal rescue cases: +10 points when resolved</li>
            <li>• Help other users: Coming soon!</li>
            <li>• Daily login: Coming soon!</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
