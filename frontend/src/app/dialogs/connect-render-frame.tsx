import { faRender, Icon } from "@rivet-gg/icons";
import {
	useMutation,
	usePrefetchInfiniteQuery,
	useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { useWatch } from "react-hook-form";
import z from "zod";
import * as ConnectRenderForm from "@/app/forms/connect-render-form";
import { type DialogContentProps, Frame } from "@/components";
import { useEngineCompatDataProvider } from "@/components/actors";
import { defineStepper } from "@/components/ui/stepper";
import { successfulBackendSetupEffect } from "@/lib/effects";
import { queryClient } from "@/queries/global";
import { EnvVariables } from "../env-variables";
import {
	configurationSchema,
	deploymentSchema,
} from "../forms/connect-manual-serverless-form";
import { StepperForm } from "../forms/stepper-form";
import { useEndpoint } from "./connect-manual-serverfull-frame";
import {
	buildServerlessConfig,
	ConfigurationAccordion,
} from "./connect-manual-serverless-frame";

const stepper = defineStepper(
	{
		id: "step-1",
		title: "Configure",
		assist: false,
		next: "Next",
		schema: z.object({}),
	},
	{
		id: "step-2",
		title: "Deploy to Render",
		assist: false,
		schema: z.object({
			...configurationSchema.shape,
			...deploymentSchema.shape,
		}),
		next: "Done",
	},
);

interface ConnectRenderFrameContentProps extends DialogContentProps {}

export default function ConnectRenderFrameContent({
	onClose,
}: ConnectRenderFrameContentProps) {
	usePrefetchInfiniteQuery({
		...useEngineCompatDataProvider().datacentersQueryOptions(),
		pages: Infinity,
	});

	return (
		<>
			<Frame.Header>
				<Frame.Title className="gap-2 flex items-center">
					<div>
						Add <Icon icon={faRender} className="ml-0.5" /> Render
					</div>
				</Frame.Title>
			</Frame.Header>
			<Frame.Content>
				<FormStepper onClose={onClose} />
			</Frame.Content>
		</>
	);
}

function FormStepper({ onClose }: { onClose?: () => void }) {
	usePrefetchInfiniteQuery({
		...useEngineCompatDataProvider().datacentersQueryOptions(),
		pages: Infinity,
	});

	const { data: datacenters } = useSuspenseInfiniteQuery(
		useEngineCompatDataProvider().datacentersQueryOptions(),
	);
	const provider = useEngineCompatDataProvider();
	const { mutateAsync } = useMutation({
		...provider.upsertRunnerConfigMutationOptions(),
		onSuccess: async () => {
			successfulBackendSetupEffect();

			await queryClient.invalidateQueries(
				provider.runnerConfigsQueryOptions(),
			);
			onClose?.();
		},
	});
	return (
		<StepperForm
			{...stepper}
			onSubmit={async ({ values }) => {
				const payload = await buildServerlessConfig(provider, values, {
					provider: "render",
				});

				await mutateAsync({
					name: values.runnerName,
					config: payload,
				});
			}}
			defaultValues={{
				runnerName: "default",
				slotsPerRunner: 1,
				minRunners: 1,
				maxRunners: 10_000,
				runnerMargin: 0,
				requestLifespan: 55,
				headers: [],
				success: false,
				datacenters: Object.fromEntries(
					datacenters.map((dc) => [dc.name, true]),
				),
			}}
			content={{
				"step-1": () => <Step1 />,
				"step-2": () => <StepDeploy />,
			}}
		/>
	);
}

function Step1() {
	return (
		<>
			<p>
				If you have not deployed a project, see the{" "}
				<a
					href="https://www.rivet.dev/docs/connect/render"
					target="_blank"
					rel="noopener noreferrer"
					className="underline hover:text-foreground"
				>
					Render quickstart guide
				</a>
				.
			</p>
			<p>
				Set these variables in Environment in the Render dashboard.
			</p>
			<EnvVariables
				endpoint={useEndpoint()}
				runnerName={useWatch({ name: "runnerName" })}
			/>
		</>
	);
}

function StepDeploy() {
	return (
		<>
			<p>
				Deploy your code to Render and paste your deployment's
				endpoint:
			</p>
			<div className="mt-2">
				<ConnectRenderForm.Endpoint placeholder="https://my-rivet-app.onrender.com" />
				<ConfigurationAccordion />
				<p className="text-muted-foreground text-sm">
					Need help deploying? See{" "}
					<a
						href="https://docs.render.com/deploys"
						target="_blank"
						rel="noreferrer"
						className="underline"
					>
						Render's deployment documentation
					</a>
					.
				</p>
			</div>
			<ConnectRenderForm.ConnectionCheck provider="render" />
		</>
	);
}
