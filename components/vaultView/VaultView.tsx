import moment from "moment";
import { useRouter } from "next/router";
import { FC, useMemo } from "react";
import styled from "styled-components";
import { useOptions } from "../../graphql/hooks/useOptions";
import BlankState from "../blankState";
import ConnectedRoute from "../connectedRoute";
import Loader from "../loader";
import PositionCard from "../positionCard";
import VaultFilter from "../vaultFilter";

const PageHeader = styled.div`
  margin-bottom: 12px;
`;

const Title = styled.div`
  color: var(--purple-blue);
  font-size: 36px;
  line-height: 1.6;
  letter-spacing: -0.01em;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const statusFilters = [
  {
    value: "open",
    label: "open",
  },
  {
    value: "closed",
    label: "closed",
  },
];

const dateFilters = [
  {
    value: "expiryDate",
    label: "expiry date",
  },
  {
    value: "exerciseDate",
    label: "exercise date",
  },
];

const VaultView: FC = () => {
  const router = useRouter();

  const statusFilter = (router.query.status as string)
    ? statusFilters.find((f) => f.value === router.query.status)
    : statusFilters[0];

  const dateFilter = (router.query.orderBy as string)
    ? dateFilters.find((f) => f.value === router.query.orderBy)
    : dateFilters[0];

  const { options, isLoading } = useOptions();

  const filteredOptions = options
    .filter((option) => {
      if (statusFilter.value === "closed") {
        return moment().unix() > option.option.expiryTimestamp;
      }

      return moment().unix() < option.option.expiryTimestamp;
    })
    .sort((a, b) => {
      if (dateFilter.value === "expiryDate") {
        return b.option.expiryTimestamp - a.option.expiryTimestamp;
      }

      return b.option.exerciseTimestamp - a.option.exerciseTimestamp;
    });

  const pageBody = useMemo(() => {
    if (isLoading) {
      return <Loader />;
    }

    if (filteredOptions.length === 0) {
      return (
        <BlankState
          title={
            {
              open: "You aren't holding any active options.",
              closed: "You aren't holding any expired options.",
            }[statusFilter.value]
          }
          subtitle={
            {
              open: 'To write a new option, click the "Write Option" button above.',
              closed:
                "Once options you've hold have expired, they will display here.",
            }[statusFilter.value]
          }
        />
      );
    }

    return (
      <OptionsGrid>
        {filteredOptions &&
          filteredOptions.map((option) => (
            <PositionCard details={option} key={option.option.id} />
          ))}
      </OptionsGrid>
    );
  }, [isLoading, filteredOptions, statusFilter]);

  return (
    <ConnectedRoute>
      <div>
        <PageHeader>
          <Title>
            Viewing{" "}
            <VaultFilter
              value={statusFilter}
              filters={statusFilters}
              onChange={(filter) => {
                router.push({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    status: filter.value,
                  },
                });
              }}
            />{" "}
            positions by{" "}
            <VaultFilter
              value={dateFilter}
              filters={dateFilters}
              onChange={(filter) => {
                router.push({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    orderBy: filter.value,
                  },
                });
              }}
            />
          </Title>
        </PageHeader>
        <div>{pageBody}</div>
      </div>
    </ConnectedRoute>
  );
};

export default VaultView;
