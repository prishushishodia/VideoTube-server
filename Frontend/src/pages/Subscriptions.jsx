import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clapperboard, ChevronRight } from "lucide-react";
import { getSubscriptions } from "../services/subscriptionService";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

const Subscriptions = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await getSubscriptions(user?._id);
        // backend returns subscription docs with a populated `channel`
        const subs = res?.data?.data || [];
        setChannels(subs.map((s) => s.channel).filter(Boolean));
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchSubscriptions();
    else setLoading(false);
  }, [user]);

  return (
    <div>
      <PageHeader
        icon={Clapperboard}
        title="Subscriptions"
        subtitle={
          loading
            ? "Loading channels…"
            : `Following ${channels.length} channel${channels.length === 1 ? "" : "s"}`
        }
      />

      {loading ? (
        <Grid>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="surface flex items-center gap-4 p-4">
              <div className="skeleton h-14 w-14 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-28 rounded" />
                <div className="skeleton h-3 w-20 rounded" />
              </div>
            </div>
          ))}
        </Grid>
      ) : channels.length === 0 ? (
        <EmptyState
          icon={Clapperboard}
          title="No subscriptions yet"
          subtitle="Subscribe to channels and they'll appear here for quick access."
          action={
            <Link to="/" className="btn btn-primary">
              Discover channels
            </Link>
          }
        />
      ) : (
        <Grid>
          {channels.map((c, i) => (
            <Link
              key={c._id}
              to={`/profile/${c._id}`}
              style={{ "--i": i % 8 }}
              className="surface group flex items-center gap-4 p-4 transition hover:border-white/15 hover:bg-panel-2"
            >
              <Avatar src={c.avatar} name={c.fullName || c.username} size="w-14 h-14" ring />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">
                  {c.fullName || c.username}
                </p>
                {c.username && (
                  <p className="truncate text-sm text-muted">@{c.username}</p>
                )}
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-brand" />
            </Link>
          ))}
        </Grid>
      )}
    </div>
  );
};

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">
    {children}
  </div>
);

export default Subscriptions;
