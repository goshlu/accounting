import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

interface StatisticsCardProps {
  stats: {
    income: number;
    expense: number;
    balance: number;
    transactionCount: number;
  };
  period: string;
}

export function StatisticsCard({ stats, period }: StatisticsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "week":
        return "本周";
      case "year":
        return "本年";
      default:
        return "本月";
    }
  };

  const cards = [
    {
      title: `${getPeriodLabel(period)}收入`,
      amount: stats.income,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: `${getPeriodLabel(period)}支出`,
      amount: stats.expense,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: `${getPeriodLabel(period)}结余`,
      amount: stats.balance,
      icon: DollarSign,
      color: stats.balance >= 0 ? "text-green-600" : "text-red-600",
      bgColor: stats.balance >= 0 ? "bg-green-50" : "bg-red-50",
    },
    {
      title: "交易笔数",
      amount: stats.transactionCount,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      isCount: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-10 h-10 rounded-full ${card.bgColor} flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{card.title}</p>
            <p className={`text-lg font-bold ${card.color}`}>
              {card.isCount ? card.amount : formatCurrency(card.amount)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
