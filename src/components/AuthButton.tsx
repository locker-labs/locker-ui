import { useClerk } from "@clerk/nextjs";

export interface IAuthButton {
	type: "sign-in" | "sign-up";
}

function AuthButton({ type }: IAuthButton) {
	const { openSignUp, openSignIn } = useClerk();

	const handleOnClick = () => {
		if (type === "sign-in") {
			openSignIn();
		} else {
			openSignUp();
		}
	};

	return (
		<button
			className={`${type === "sign-in" ? "bg-light-400 hover:bg-light-500 dark:bg-dark-300 dark:hover:bg-dark-200" : "bg-secondary-100 text-light-200 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"} h-10 w-24 items-center justify-center rounded-full outline-none`}
			onClick={handleOnClick}
		>
			{type === "sign-in" ? "Sign In" : "Sign Up"}
		</button>
	);
}

export default AuthButton;
