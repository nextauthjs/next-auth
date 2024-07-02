import { component$ } from "@builder.io/qwik";

type Props = {
  src: string;
  alt: string;
};

export const Avatar = component$<Props>((props) => {
  return (
    <img
      src={props.src}
      alt={props.alt}
      class="overflow-hidden rounded-full border border-slate-300 leading-[0px]"
      width="40"
      height="40"
    />
  );
});
